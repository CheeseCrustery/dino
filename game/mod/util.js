// Generate random integer in range
export function randomIntRange(min, max){
	const r = Math.random()*(max-min) + min
	return Math.round(r)
}