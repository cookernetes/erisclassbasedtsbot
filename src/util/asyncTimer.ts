export default async function awaitTimer(msTime: number) {
	await new Promise((resolve) => setTimeout(resolve, msTime));
}
