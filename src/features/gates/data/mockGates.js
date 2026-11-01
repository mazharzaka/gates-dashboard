// TODO: replace with real gate coordinates
export const initialMockGates = [
  {
    id: "GATE-01",
    name: "البوابة الرئيسية الشمالية",
    nameEn: "Main North Gate",
    status: "open",
    inside: 142,
    entriesToday: 385,
    assignedTo: ["guard"],
    location: {
      lat: 30.0444,
      lng: 31.2357,
      address: "طريق النصر، المدخل الشمالي، القاهرة",
    },
  },
  {
    id: "GATE-02",
    name: "بوابة الموظفين والشركاء",
    nameEn: "Staff & Partners Gate",
    status: "open",
    inside: 89,
    entriesToday: 210,
    assignedTo: ["guard2"],
    location: {
      lat: 30.0521,
      lng: 31.2438,
      address: "شارع الشركات، مبنى الخدمات الإدارية، القاهرة",
    },
  },
  {
    id: "GATE-03",
    name: "بوابة الشحن والخدمات اللوجستية",
    nameEn: "Cargo & Logistics Gate",
    status: "closed",
    inside: 24,
    entriesToday: 68,
    assignedTo: ["guard2"],
    location: {
      lat: 30.0612,
      lng: 31.2589,
      address: "المنطقة الصناعية، مدخل الشاحنات الشرقي، القاهرة",
    },
  },
  {
    id: "GATE-04",
    name: "بوابة كبار الشخصيات والضيوف",
    nameEn: "VIP & Visitors Gate",
    status: "open",
    inside: 18,
    entriesToday: 45,
    assignedTo: [],
    location: {
      lat: 30.0735,
      lng: 31.2214,
      address: "شارع التحرير، المدخل الشرفي لكبار الزوار، القاهرة",
    },
  },
];
