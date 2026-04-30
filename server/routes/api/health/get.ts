export function handleHealthGet(): Response {
	return Response.json({
		status: 'ok',
		time: new Date().toISOString()
	});
}
