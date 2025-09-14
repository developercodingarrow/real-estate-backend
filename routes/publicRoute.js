const express = require("express");
const router = express.Router();
const publicConroller = require("../controllers/publicConroller");

router.get(
  "/getresidentialRentAllProjects",
  publicConroller.getResidentialRentProject
);

router.get(
  "/getresidentialbuyAllProjects",
  publicConroller.getResidentialBuyProject
);

router.get(
  "/getresidentialRentBypropertyType/:slug",
  publicConroller.getResidentialRentProjectByType
);

router.get(
  "/getresidentialBuyBypropertyType/:slug",
  publicConroller.getResidentialBuyProjectByType
);

router.get(
  "/getCommercialRentAllProjects",
  publicConroller.getCommercialRentProject
);

router.get(
  "/getCommercialBuyAllProjects",
  publicConroller.getCommercialBuyProject
);

router.get(
  "/getCommercialRentBypropertyType/:slug",
  publicConroller.getCommercialRentProjectByType
);

router.get(
  "/getCommercialBuyBypropertyType/:slug",
  publicConroller.getCommercialBuyProjectByType
);

router.get(
  "/getCommercialBuyByCity/:slug",
  publicConroller.getCommercialBuyProjectByCity
);

router.get(
  "/getCommercialBuyByLocation/:slug",
  publicConroller.getCommercialBuyProjectByLocation
);

router.get(
  "/getCommercialRentByCity/:slug",
  publicConroller.getCommercialRentProjectByCity
);

router.get(
  "/getCommercialRentByLocation/:slug",
  publicConroller.getCommercialRentProjectByLocation
);

router.get(
  "/getResidentialBuyByCity/:slug",
  publicConroller.getResidentialBuyProjectByCity
);

router.get(
  "/getResidentialBuyByLocation/:slug",
  publicConroller.getResidentialBuyProjectByLocation
);

router.get(
  "/getResidentialRentByCity/:slug",
  publicConroller.getResidentialRentProjectByCity
);

router.get(
  "/getResidentialRentByLocation/:slug",
  publicConroller.getResidentialRentProjectByLocation
);
router.get("/getpropertyBySlug/:slug", publicConroller.getProjectBySlug);

router.get("/getAllBlogs", publicConroller.allBlogs);
router.get("/sidebarFeatured", publicConroller.getSidebarFeaturedProject);
router.get("/singleBlog/:slug", publicConroller.getSingleBlog);
router.get(
  "/upcomingApartmentProjects",
  publicConroller.getupcomingApprtmentProjects
);
router.get(
  "/underconstructionApprtmentProjects",
  publicConroller.getUnderconstructionApprtmentProjects
);

router.get(
  "/getFeaturedProjectLinks",
  publicConroller.getallFeaturedProjectLinks
);
module.exports = router;
