// controllers/enquireController.js
const ExcelJS = require("exceljs");
const Enquire = require("../models/enquireModel");

exports.exportEnquiresToExcel = async (req, res, next) => {
  try {
    // 1. Fetch all enquires
    const enquires = await Enquire.find().lean();

    // 2. Create workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Enquires");

    // 3. Add headers
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile Number", key: "mobileNumber", width: 20 },
      { header: "Page URL", key: "pageUrl", width: 40 },
      { header: "IP Address", key: "ipAddress", width: 20 },
      { header: "User Agent", key: "userAgent", width: 50 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    // 4. Add rows
    enquires.forEach((enquire) => {
      worksheet.addRow({
        name: enquire.name,
        email: enquire.email,
        mobileNumber: enquire.mobileNumber,
        pageUrl: enquire.pageUrl,
        ipAddress: enquire.ipAddress,
        userAgent: enquire.userAgent,
        createdAt: enquire.createdAt.toLocaleString(),
      });
    });

    // ✅ Generate a filename with today’s date
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `enquires_${formattedDate}.xlsx`;

    // 5. Write file to response (download)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};
