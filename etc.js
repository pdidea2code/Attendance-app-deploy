const leaveCountCorrentYear = async (req, res, next) => {
  try {
    const currentDates = new Date();
    const startDateYear = new Date(currentDates.getFullYear(), 0, 1);
    const startDateJoin = new Date(req.user.createdAt);
    const startDate = startDateYear > startDateJoin ? startDateYear : startDateJoin;
    const currentDate = new Date(startDate);
    let totalMonths = currentDates.getMonth() + 1;
    console.log(startDate);
    if (startDateJoin === startDate) {
      totalMonths = currentDate.getMonth() + 1;
    }
    if (startDate === startDateJoin) {
      const start = currentDate.getMonth() + 1;
      const end = currentDates.getMonth() + 1;
      totalMonths = end - start;
    }
    console.log(totalMonths);
    const leaveCounts = await Leave.aggregate([
      {
        $match: {
          user_id: req.user._id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const leaveStatusCounts = leaveCounts.reduce(
      (acc, leave) => {
        acc[leave._id] = leave.count;
        return acc;
      },
      { Pending: 0, Rejected: 0, Approved: 0 }
    );

    const { Pending, Rejected, Approved } = leaveStatusCounts;

    let availableLeave = totalMonths;
    const currentMonthApprovedLeaves = Approved;
    const currentMonthPendingLeaves = Pending;
    const totalLeavesThisMonth = currentMonthApprovedLeaves + currentMonthPendingLeaves;
    availableLeave -= totalLeavesThisMonth;

    availableLeave = Math.max(availableLeave, 0);
    const totalAvailableLeave = availableLeave + currentMonthPendingLeaves;

    const data = {
      Pending,
      Rejected,
      Approved,
      availableLeave,
    };

    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};
