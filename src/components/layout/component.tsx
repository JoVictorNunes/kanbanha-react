import React from "react";
import classes from "./styles.module.css";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  const { children } = props;
  return <div className={classes.layout}>{children}</div>;
};

export default Layout;
