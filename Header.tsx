'use client';
import Link from "next/link";
import {Search,Heart,ShoppingCart,UserRound,ChevronDown,Flame} from "lucide-react";
import {useEffect,useState} from "react";
export default function Header(){
 const [count,setCount]=useState(0);
 useEffect(()=>{const update=()=>setCount(Number(localStorage.getItem("nesta-cart-count")||0));update();window.addEventListener("storage",update);window.addEventListener("nesta-cart",update);return()=>{window.removeEventListener("storage",update);window.removeEventListener("nesta-cart",update)}},[]);
 return <>
 <div className="topbar"><span>🚚 Free Delivery Across Ghana 🇬🇭</span><div>Track Order　|　Help　|　Contact Us</div></div>
 <header><Link href="/" className="brand"><div className="logo-mark">N</div><div><div className="logo">NESTA</div><div className="tagline">Your Style. Your Choice.</div></div></Link>
 <form className="search" action="/shop"><input name="q" placeholder="Search for products..."/><button><Search size={21}/></button></form>
 <div className="head-actions"><Link href="/account"><UserRound/><span>Account</span></Link><Link href="/wishlist"><Heart/><span>Wishlist</span></Link><Link href="/cart" className="cart-head"><ShoppingCart/><b>{count}</b><span>Cart</span></Link></div></header>
 <nav><Link className="active" href="/">⌂　Home</Link><Link href="/shop">Shop <ChevronDown size={15}/></Link><Link href="/shop">Categories <ChevronDown size={15}/></Link><Link href="/shop">New Arrivals</Link><Link href="/shop?deal=1">Deals <Flame size={16}/></Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
 </>}
