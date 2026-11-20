"use client";
import dynamic from "next/dynamic";
const Preview = dynamic(() => import("./Preview"), { ssr: false });
export function Mount() { return <Preview />; }
