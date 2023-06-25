import { ReactNode } from "react";
import classes from "./styles.module.css";

interface Props {
  children: ReactNode;
  title: string;
  counter?: number;
}

const Card: React.FC<Props> = (props) => {
  const { children, counter, title } = props;
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.left}>{title}</div>
        <div className={classes.right}>{counter}</div>
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Card;
