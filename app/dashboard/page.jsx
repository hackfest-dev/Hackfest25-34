import { getServerSession } from "next-auth";
import { handler } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
	const session = await getServerSession(handler);

	if (!session) {
		return <p className="text-center mt-20 text-xl">Access Denied</p>;
	}

	return (
		<div className="text-center mt-20">
			<h1 className="text-2xl font-bold">
				Welcome, {session.user.name}!
			</h1>
			<p className="mt-2">Email: {session.user.email}</p>
		</div>
	);
}
