import React from "react";
import Header from "./Header";
import CartOverview from "../features/cart/CartOverview";
import { Outlet, useMatch, useNavigation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "./Loader";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  // the home page photo runs edge to edge, every other page is a centered column
  const isHomePage = useMatch("/");
  return (
    // h-dvh, not h-screen: on phones 100vh reaches under the browser's toolbar and hides the footer
    <div className="grid h-dvh grid-rows-[auto_1fr_auto] overflow-hidden">
      {isLoading && <Loader />}
      <Header />
      <div className="overflow-y-auto">
        <main className={isHomePage ? "h-full" : "mx-auto max-w-3xl"}>
          <Outlet />
        </main>
      </div>
      <CartOverview />
      {/* bottom offset keeps toasts above the cart footer */}
      <Toaster
        position="bottom-center"
        containerStyle={{ bottom: 80 }}
        toastOptions={{
          style: {
            borderRadius: "1rem",
            padding: "10px 14px",
            color: "#292524",
          },
        }}
      />
    </div>
  );
}

export default AppLayout;
