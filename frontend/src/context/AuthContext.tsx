import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	useEffect,
} from "react";

type AuthContextType = {
	isAuth: boolean;
	setIsAuth: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const storedToken = localStorage.getItem("token");
	const [isAuth, setIsAuth] = useState<boolean>(!!storedToken);

	useEffect(() => {
		if (isAuth) {
			const token = localStorage.getItem("token");
			if (!token) {
				// TODO: replace with real token from login API
				localStorage.setItem("token", "dummy-token");
			}
		} else {
			localStorage.removeItem("token");
		}
	}, [isAuth]);

	return (
		<AuthContext.Provider value={{ isAuth, setIsAuth }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
