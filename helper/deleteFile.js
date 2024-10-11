const fs = require("fs");

// module.exports = deleteFiles = (files) => {
//   const basePath = "./public/" + files;
//   try {
//     //Delete multiple files
//     if (Array.isArray(files)) {
//       files.forEach((basePath) => {
//         console.log(basePath, "line no 11");

//         if (fs.existsSync(basePath)) {
//           fs.unlinkSync(basePath);
//         }
//       });
//     } else {
//       if (fs.existsSync(basePath)) {
//         fs.unlinkSync(basePath);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = deleteFiles = (files) => {
  const basePath = __dirname + "/../public/" + files;
  try {
    // Delete multiple files
    if (Array.isArray(files)) {
      files.forEach((file) => {
        console.log(basePath, "line no 34");
        if (fs.existsSync(basePath)) {
          fs.unlinkSync(basePath);
        }
      });
    } else {
      if (fs.existsSync(basePath)) {
        fs.unlinkSync(basePath);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
