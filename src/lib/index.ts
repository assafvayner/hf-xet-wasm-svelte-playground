import init, { chunk_vec, chunk_array_buffer, ChunkInfo } from 'hf_xet_wasm';

const DEFAULT_SIZE_IN_MB = 20;

export async function callMe() {
	await init();

	const buffer = generateRandomData(DEFAULT_SIZE_IN_MB);
	const result1: ChunkInfo[] = chunk_array_buffer(buffer);
	const array = new Uint8Array(buffer);
	const result2: ChunkInfo[] = chunk_vec(array);
	console.log(`chunk array buffer:\n${result1}`);
	console.log(`chunk vec:\n${result2}`);

	if (result1.length !== result2.length) {
		console.error('mismatch in length');
		return;
	}

	console.log(`num chunks returned ${result1.length}`);

	let err;
	for (let i = 0; i < result1.length; i++) {
		const chunk_info_1 = result1[i];
		const chunk_info_2 = result2[i];
		if (chunk_info_1.hash !== chunk_info_2.hash) {
			console.error(`index ${i}, hash mismatch 1: ${chunk_info_1.hash} 2: ${chunk_info_2.hash}`);
			err = true;
		}

		if (chunk_info_1.len !== chunk_info_2.len) {
			console.error(`index ${i}, len mismatch 1: ${chunk_info_1.len} 2: ${chunk_info_2.len}`);
			err = true;
		}
	}
	if (err) {
		return;
	}

	for (let i = 0; i < result1.length; i++) {
		const chunk_info_1 = result1[i];
		console.log(`chunk index ${i}, len: ${chunk_info_1.len}, hash: ${chunk_info_1.hash}`);
	}
}

/**
 * Generates a specified amount of random data and returns it as an ArrayBuffer.
 *
 * @param sizeInMB The size of the data to generate in megabytes.
 * @returns An ArrayBuffer containing the random data, or undefined on error.
 */
function generateRandomData(sizeInMB: number): ArrayBuffer {
	// Calculate the size in bytes.
	const sizeInBytes = sizeInMB * 1024 * 1024;

	// Check for valid size.
	if (sizeInBytes <= 0 || !Number.isInteger(sizeInBytes)) {
		console.error('Invalid size. Size must be a positive number.');
		throw new Error('invalid parameter');
	}

	// Create a new ArrayBuffer with the calculated size.
	const buffer = new ArrayBuffer(sizeInBytes);

	// Create a Uint8Array view of the ArrayBuffer to efficiently write random data.
	const view = new Uint8Array(buffer);

	// Populate the buffer with random data.  Use a more robust method.
	for (let i = 0; i < sizeInBytes; i++) {
		view[i] = Math.floor(Math.random() * 256); // 0-255
	}
	return buffer;
}
