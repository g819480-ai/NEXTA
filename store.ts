export type Product={id:string,name:string,price:number,rating:string,category:string,emoji:string,description:string,sizes?:string[]};

export const products:Product[]=[
{id:"premium-tee",name:"NESTA Premium Tee",price:120,rating:"4.8",category:"Fashion",emoji:"👕",description:"A clean everyday premium tee designed for comfort and easy styling.",sizes:["S","M","L","XL"]},
{id:"air-sneakers",name:"Air Force Style Sneakers",price:650,rating:"4.9",category:"Shoes",emoji:"👟",description:"Classic everyday sneakers with a clean streetwear profile.",sizes:["39","40","41","42","43","44"]},
{id:"shoulder-bag",name:"Stylish Shoulder Bag",price:250,rating:"4.7",category:"Bags",emoji:"👜",description:"A versatile shoulder bag for everyday outfits and occasions."},
{id:"wireless-earbuds",name:"Wireless Earbuds",price:350,rating:"4.8",category:"Electronics",emoji:"🎧",description:"Compact wireless earbuds for calls, music and everyday listening."},
{id:"smart-watch",name:"Smart Watch Series 9",price:700,rating:"4.9",category:"Electronics",emoji:"⌚",description:"A modern smartwatch for everyday activity and notifications."},
{id:"classic-cap",name:"Classic NESTA Cap",price:90,rating:"4.6",category:"Accessories",emoji:"🧢",description:"A simple adjustable cap to finish your everyday look."}
];

export const categories=["Fashion","Shoes","Bags","Electronics","Accessories","Home & Living","Others"];
export function getProduct(id:string){return products.find(p=>p.id===id)}
