import React from 'react';
import { Template, Font, checkTemplate } from "@pdfme/generator";
import {  BLANK_PDF } from '@pdfme/common';


const fontObjList = [
  {
    fallback: true,
    label: "NotoSerifJP-Regular",
    url: "/fonts/NotoSerifJP-Regular.otf",
  },
  {
    fallback: false,
    label: "NotoSansJP-Regular",
    url: "/fonts/NotoSansJP-Regular.otf",
  },
  {
    fallback: false,
    label: "NotoSansSC-Regular",
    url: "/fonts/NotoSansSC-Regular.otf",
  },
  {
    fallback: false,
    label: "ZenKurenaido-Regular",
    url: "/fonts/ZenKurenaido-Regular.ttf",
  },
];

export const getFontsData = async () => {
  const fontDataList = await Promise.all(
    fontObjList.map(async (font) => ({
      ...font,
      data: await fetch(font.url).then((res) => res.arrayBuffer()),
    }))
  );

  return fontDataList.reduce(
    (acc, font) => ({ ...acc, [font.label]: font }),
    {}
  );
};

export const readFile = (
  file,
  type
) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      if (e && e.target && e.target.result && file !== null) {
        resolve(e.target.result);
      }
    });
    if (file !== null) {
      if (type === "text") {
        fileReader.readAsText(file);
      } else if (type === "dataURL") {
        fileReader.readAsDataURL(file);
      } else if (type === "arrayBuffer") {
        fileReader.readAsArrayBuffer(file);
      }
    }
  });
};

export const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));

export const getTemplateFromJsonFile = (file) => {
  return readFile(file, "text").then((jsonStr) => {
    const template = JSON.parse(jsonStr);
    try {
      checkTemplate(template);
      return template;
    } catch (e) {
      throw e;
    }
  });
};

export const downloadJsonFile = (json, title) => {
  if (typeof window !== "undefined") {
    const blob = new Blob([JSON.stringify(json)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getTemplate = () => {
  const template = {
    schemas: [
        {
          Name: {
            type: "text",
            position: { x: 13.5, y: 60.33 },
            width: 49.23,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          Date: {
            type: "text",
            position: { x: 115.93, y: 44.33 },
            width: 24,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          Contact: {
            type: "text",
            position: { x: 101.07, y: 61.53 },
            width: 37,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          From: {
            type: "text",
            position: { x: 10.9, y: 80.64 },
            width: 57,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          To: {
            type: "text",
            position: { x: 90.49, y: 80.7 },
            width: 50,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          vehicleNo: {
            type: "text",
            position: { x: 18, y: 88 },
            width: 49,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          Weight: {
            type: "text",
            position: { x: 100.81, y: 93.72 },
            width: 45,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          Material: {
            type: "text",
            position: { x: 14.82, y: 94.81 },
            width: 45,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          Fare: {
            type: "text",
            position: { x: 9.52, y: 111.77 },
            width: 45,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          otherCharger: {
            type: "text",
            position: { x: 23.67, y: 126.33 },
            width: 45,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          totalAmount: {
            type: "text",
            position: { x: 105.93, y: 126.06 },
            width: 33,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          Advance: {
            type: "text",
            position: { x: 99.22, y: 111.77 },
            width: 38,
            height: 3,
            rotate: 0,
            alignment:"left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          detention: {
            type: "text",
            position: { x: 18.58, y: 119.65 },
            width: 45,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          Balance: {
            type: "text",
            position: { x: 96.84, y: 119.56 },
            width: 42,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          vehicleType: {
            type: "text",
            position: { x: 101.61, y: 87.25 },
            width: 38,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          DriverName: {
            type: "text",
            position: { x: 19.58, y: 143.2 },
            width: 45,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          ownerNo: {
            type: "text",
            position: { x: 99.93, y: 150.88 },
            width: 38,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          DriverNo: {
            type: "text",
            position: { x: 18.08, y: 149.87 },
            width: 45,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          ownerName: {
            type: "text",
            position: { x: 101.07, y: 143.93 },
            width: 38,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          },
          remark: {
            type: "text",
            position: { x: 18.26, y: 159.55 },
            width: 123,
            height: 3,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 8,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            // fontName: "Roboto"
          }
        }
      ],
      
      
      basePdf: "/BIHAR TRANSPORT.pdf",

    sampledata :[
    {
      Name: "Jyoti",
      Date: "9 March 2024...",
      Contact: "Type Something...",
      From: "Jalandhar",
      To: "Delhi",
      vehicleNo: "UGYVGF68",
      Weight: "80 kg",
      Material: "Paper",
      Fare: "Rs 800 ",
      otherCharger: "Rs 100.0",
      totalAmount: "Rs 600",
      Advance: "Rs 600",
      detention: "Nan",
      Balance: "Rs 7000",
      vehicleType: "Bus",
      DriverName: "Ayush Mehra",
      ownerNo: "1234567890",
      DriverNo: "1234567890",
      ownerName: "Vivek Kumar",
      remark: "remark\n\n"
    }
  ],
  columns: ["Name", "Date", "Contact", "From", "To", "vehicleNo", "Weight" , "Material" , "Fare" , "otherCharger","totalAmount","Advance","detention","Balance","vehicleType","DriverName" ,"ownerNo" ,"DriverNo" ,"ownerName" ,"remark"],


  };
  return template;
};
