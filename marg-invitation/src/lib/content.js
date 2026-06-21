/**
 * Centralized content — all copy, image URLs and structured data for the
 * sections live here so components stay presentational and content edits
 * happen in one place. Image URLs are the exact CDN links from the source HTML.
 */

export const COUPLE = { bride: "Sowmitha", groom: "Surya", initials: "S & S" };

export const IMG = {
  heritage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCbeGWlLCSmLGbwa4_AE6yX2DjwVyh1oYvKnjCN8ORFjfO4lqT0TIS4syhn1yftuXE73aYZmWnpz278w2z8Kf1LsrNJwdzr7TeVX0cpmePQzDHHgrq17WqsidoSmeS4I3sSLJTetQFAlhTF8ATNb55-4653W_oP6u86y-wzTJKUF1JQS1lcanCzCo3HeYln0Sogc2pc0JV75Zv0nGJJyy4DeRS5uu4AtrqwK-W-j9DgX6ZZ7BwVaiVm6hxnE0daB0boMyRQF4rcW2U",
  groom:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBLd6kOjGOol9uOUX_N-GxUkx40lymeikh_AAtw12xZcy4laIoaG7kM_Q76RKtwQCdO0PFSfxhFdDSQ2YDzodsQZEg0e2Iu6tVik83Qirx_Y5-Rg3OePZqpl_bvZpFe51v_QwPJA8kZk-XGIHu72tbLeryzVLU2iqcL8hhVMMJ0SucuaAhaD__0YCAKMEpePnXhSLxXTMeN3o-Tk5Whc1E43GJIQlv5CMtso8Zlql1MT1supjtGCA58g4JEB31mV6Y-t7rchtIftnY",
  bride:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuArHyKHWQ6g7CLaXeCUJ61NrW0TUTF6TXnouCVAy1PgdTWZ9bLqLmV6hKJRxkBl5Vs4KiBJbtCuhpRPOihb-ubJE9e1lyeQXyVTpcJtTptfhvAhu6gY_APS8QwjliWmpV1-QbzTAkNUNFJbN6xwZ0n0IJwsPxCi3Z3Mg7q-V5v-VbdpzMrA7OvXt-A7HO6jxu6C20L_c0Q5tsbxDuVPpBS0oq0x-ElkvI1NoXmXDeDKkzuPpJG-E0b6XDhZYpe9FGPBZgDC_WqTlGg",
  saveTheDate:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA1vOw-jMGhp3v7TXnx2aYX6-Ash4_9gWo8_KPplXTzX-j-AEUEA6siKyEpXVuB9U61ME-2yykv2BxXsBSZOqBAHPdDoz_cpi-c9NQs6PR8J3di_GPOys_JgMNxaX_pArYDQmMbahXG4s4yVZR3aHUB5vVzUoIiBLu-lsph_mTB5-JWZndrPqEMxbmWFRoix98Jv2ds4A-S0l88BlDIOvpLZ0Di6zxjtqx2AmSBqikFDU_cBtVyCw7LwcPZR8BIKu20xrhyfAATMy8",
  venue:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBHfl8Mtx1I0SpSS5vw6Bx7pmo1DAwJPk0WVajvGdBiBU_WLeyw4dHO0MWK3e8AAFQlElBCS4PFzgLvgA9GGDRk4Fx9jsbZYyu3KBAdwtnpF46f_fofnzHtDqqljJ4OSzX-bhZp3xG9aaXn-35V8DMad3N8UqLpFIARww78Yq-qyB3DN2L3ffTP8hCf1yS3VbJ3HUpnIAyVIK_CTTE75vtlJ4chQDkbqVOirj6SuJYrDcryHy8CnyQWM0_6XYXPGFfheEXTH0SCNKc",
  venueMap:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDnLlhkRQNejlm76eByQZDZS1thoxxLUQAK36hiZkBymWqtaqNH1Y37x0kMgSflXIxo9iKLVU_D4DDhwEJ4Gz3TfygbOaFncwEBcjzucMYQK7MKODoSfNqZ-y_VIEyjXhZnB9KzlznSof0avb3Fs14ve3K31pZYFR2Qb2rFZpzmQ6NwDXU5wpfjGX4nxLmxosg9-aN-4SYlVErBN_s2gItO7xFZbzOhFMKQw_sjffB2QYhf9gQkjtwSaYyhr-UuQ3Oojy-E4I4Mo1g",
};

export const VENUE = {
  label: "THE VENUE",
  heading: "A Sacred Beginning",
  description:
    "Nestled in the heart of Bodinayakanur, Duraiyappa Nadar Thangamal Mahal provides the perfect setting for our special day. Surrounded by tradition, warmth, and the blessings of loved ones, this beautiful venue will witness the beginning of our forever journey together.",
  name: "Duraiyappa Nadar Thangamal Mahal",
  address: [
    "Parasakthi Milk Station Road,",
    "Ammankulam,",
    "Bodinayakanur,",
    "Theni District,",
    "Tamil Nadu 625513",
  ],
  // ── ONE canonical Google Maps location, used by EVERY action ──
  // `maps/search/?api=1&query=…` is the official, most reliable "open this exact
  // place" link: Google resolves the named venue and drops the pin on it. The
  // coordinates are appended so it lands on the precise spot even if the name
  // ever changes. Opening this on any device shows Duraiyappa Nadar Thangamal
  // Mahal directly (not a nearby area).
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Duraiyappa%20Nadar%20Thangamal%20Mahal%2C%20Bodinayakanur%2C%20Theni%20District%2C%20Tamil%20Nadu%20625513",
  // Turn-by-turn directions from the guest's current location to the same venue
  // (no manual start input). Used by the Get Directions button + the QR code.
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Duraiyappa%20Nadar%20Thangamal%20Mahal%2C%20Bodinayakanur%2C%20Theni%20District%2C%20Tamil%20Nadu%20625513",
};

// Pre-formatted message shared via WhatsApp / SMS / the native share sheet.
export const VENUE_SHARE_MESSAGE = [
  `💍 ${COUPLE.bride} & ${COUPLE.groom} — Wedding Venue`,
  "",
  VENUE.name,
  "",
  ...VENUE.address,
  "",
  "Google Maps:",
  VENUE.mapUrl,
].join("\n");

export const RITUALS = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkVsCsjUrgZhoq60S-g1Z1poiODC_Nqc_jrYTPP8VeYw4hAluHFgs_C2mwuPgLaTAiLWx_3sQwb9guHv_LEs3lkXl8Hm15iz-SZ8kms0bym4CcAY6t-QtmhTs2OCB-ifo2S3pB3Al1ziit-IjIGORValGN_Ha-8cdci_81eMVpbR1CJ7LSNsqnqCW13xJda_BpIEOHW4mxy-aDG6mDibHDNr4jTUfy0p8nnqu8Kv5sp8fVSzz0vfx2w1o4TC2vGrQCwwLsKhXYci4",
    title: "Nichayathartham",
    icon: "engagement",
    date: "11.07.26",
    desc: "A cherished celebration where two families come together with love, blessings, and joyful hearts, marking the beginning of our forever.",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_IMOlxcGByk53D7Y1MP24kJLiuCzk45PXczSV2rKER8XLUQSyxqNVRSlG747zNSQyGZv0vza5OBBWySi0NsJUbhn3jRu3IBre2W0-N7GQyO9PNIM4L4gyCQA_YoFDIDaesxuA_1dNE0EEctjTWkak0Un4Z3aJRYK_xQuJMx_ZQUBB_tH-axyR6fm1sgkWSMQwQCf7crcrloEoi-cjCHFP7pEQnN1Zaa8pqBRLAZ1jDJluNk5SHb60zd7mjw_Lnox228h5iit-FXA",
    title: "Muhurtham",
    icon: "vows",
    date: "12.07.26",
    desc: "The sacred moment when vows are exchanged and two souls unite, embarking on a lifetime of love, laughter, and togetherness.",
  },
];

export const GALLERY = [
  {
    span: "col-span-2 row-span-2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3bOmdTqEZI0htTo_pxJAS_0Q1ZrQwMQUazZtXiDLDBOjdhvY2bCz8Cibq2oeDWHWYZH2vE973EPJ9HqrFZEgegNto4amyGoD7wYZSB0BGrkrgfUrOOQoBuJjMZJy1HXkVMMhXK8PqIjA_IlJQlhpM1clIygz63KXB48uSUTjBhny1r8YbMNwNY_H1bEIH-BkIGF6MNx3uH2PrCnBYbtWOSZfnQD_TxpI9pAwU1T5enei9YZwJB3qlBQhlaNvDXEBgpJEXGbWFO2Q",
  },
  {
    span: "",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWZpytA3wUdiy9Q01It45HclQ48s_mZUAmbVzgfHoKI9L9GAKyLmLEo6BCmPhDt7PF49-_r94MMrMHD5s3NiaYeGVR70tD1DxSL-D9RdB3JxetK3Ymrsxzobs4V9RWEhPM4--oiXEXEdu4dPsft7L5UZZ96_9TdBw0D1uihoa78Y_JWC6jgAFtNI_z1xe7O90kp38LoerGYbxlNzNI1C9TnEiggyAgXvkhbp_xlYIJ_LlCumJ6_U1QdT-QAFvVE1sltntjJZz8mBk",
  },
  {
    span: "row-span-2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoki6_hV7zk4ku6xu42voxq2VXbyHfcphPQRuelxQ3yoaHCDtgyY9kWZtUn-xk07Pvuxw5Mtwj7frXwFGVBPlDlT0HKRDos9Geu5gW8RlR8heqQui-qsZszmGBVKVspJq1cz64tXetyImngN4zhM0plWeCse-kKUrI-WCRt7WbvNwPsiWpFFg0DEhExyAqgjdIYe9hwAw_X1kquN_iumpaSysf8n3VACWWatxiYxDozIoTy_eLBJ3MbP6mMH8kkbtLStEczFRBr-g",
  },
  {
    span: "",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvQ2F-TpWsrkHRwDGygMSocggnWoFJD9Eu7y9v9Arjdv5cDTNDR2BO5BCuLCNMDCBJXiv9yBnfbKWX3b5cyvFNtNhj4qe1OTZmYPHfyiQ8icTDtzVjppJ3j6Q13GNsELVLbERLSCkzJZNk--WDFcyf7SKMBzuqzR033ZawubWAjwQYLf1ZU4utG-s2xE4JDVgw_A3JzUifKCb-L8mm6LLmu62BA5FSN9xmxq-OUOcm25BnwPF1deHhlqDp6zYwzLGioh3HO6fNxBo",
  },
  {
    span: "col-span-2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDISoH-MiQu9JnhnUdtc7H4oniHh2qZjmS4Qpk8vSoQ_PyylvXNi_AyUdkG6DPNzeAFL5nWgGAj0vlrqnZlGk2SSDjaD4w2zqI7bBfoBhqOybpsPc651Yq2LDMyQkoWAjwZrRiaUvguGGBpnpkRIx9XH6aa0k9kNwY5tDd__Cik2ZRsGpqaiKqn-HnAJZZOU2pU5LeocaZ31i9AiOf5v9jiMQQFtPBkxmwursbCoEy2g0HKLibuF5WU4h_Z7MFt4CXcwYIpbTi68W0",
  },
];

export const BLESSINGS = [
  { icon: "tradition", label: "TRADITION" },
  { icon: "heritage", label: "HERITAGE" },
  { icon: "family", label: "FAMILY" },
  { icon: "devotion", label: "DEVOTION" },
];
