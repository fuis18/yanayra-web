import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";
import MyForm from "./components/MyForm";

function App() {
	return (
		<>
			<Header></Header>
			<Main>
				<MyForm></MyForm>
			</Main>
		</>
	);
}

export default App;
