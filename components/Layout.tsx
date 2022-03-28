import Header from "./Header";
import Footer from "./Footer";
import { Color } from "../types";

type LayoutProps = {
  children: React.ReactNode;
  theme: Color;
};

const Layout = ({ children, theme }: LayoutProps) => {
  return (
    <>
      <Header theme={theme} />
      {children}
      <Footer theme={theme} />
    </>
  );
};

export default Layout;
