import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext<{
	signIn: (username: string, tokenString: string) => void;
	signOut: () => void;
	session?: string | null;
	token?: string | null;
	isLoading: boolean;
}>({
	signIn: (username: string, tokenString: string) => null,
	signOut: () => null,
	session: null,
	token: null,
	isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
	const value = useContext(AuthContext);
	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error(
				"useSession must be wrapped in a <SessionProvider />"
			);
		}
	}

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState("session");
	const [[tmp, token], setToken] = useStorageState("token");

	return (
		<AuthContext.Provider
			value={{
				signIn: (username: string, tokenString: string) => {
					// Perform sign-in logic here
					setSession(username);
					setToken(tokenString);
				},
				signOut: () => {
					setSession(null);
					setToken(null);
				},
				session,
				token,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
