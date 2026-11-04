import Image from "next/image";
import "./ProductPhone.css";

export function ProductPhone() {
  return <div className="product-device-scene">
    <svg className="product-device-waves" viewBox="0 0 700 650" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#e9dcef" opacity=".65" d="M0 350C150 400 170 100 370 190S580 340 700 210V530C510 650 400 370 230 450S80 560 0 510Z"/>
      <path fill="#dac5e5" opacity=".45" d="M0 450C180 510 180 260 380 340S580 460 700 340V470C560 590 410 430 260 510S90 610 0 570Z"/>
      <path fill="none" stroke="#b799c8" opacity=".4" d="M0 325C150 375 170 75 370 165S580 315 700 185M0 475C180 535 180 285 380 365S580 485 700 365"/>
    </svg>
    <figure className="product-iphone16" aria-label="DAD Report in an iPhone 16 mockup">
      <span className="product-device-action" aria-hidden="true"/><span className="product-device-volume" aria-hidden="true"/><span className="product-device-power" aria-hidden="true"/><span className="product-device-camera" aria-hidden="true"/>
      <div className="product-device-screen"><Image src="/images/dad-app.webp" alt="DAD Report app with health records, report upload, insurance and treatment folders" width={708} height={1535} sizes="(max-width:640px) 220px, 250px"/><span className="product-device-island" aria-hidden="true"><span/></span><span className="product-device-home" aria-hidden="true"/></div>
    </figure>
  </div>;
}
