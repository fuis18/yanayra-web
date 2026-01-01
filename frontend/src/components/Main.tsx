import type { ReactNode } from "react";

type MainProps = {
	children: ReactNode;
};

const Main = ({ children }: MainProps) => {
	return <main className="container">{children}</main>;
};

export default Main;
