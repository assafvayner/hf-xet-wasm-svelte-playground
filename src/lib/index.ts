import { chunk, ChunkInfo } from '../../../../hf/xet-core/hf_xet_wasm/pkg/hf_xet_wasm';

const DEFAULT_SIZE_IN_MB = 20;

export async function callMe() {
	const buffer = generateRandomData(DEFAULT_SIZE_IN_MB);
	const result1: ChunkInfo[] = chunk(buffer);
	console.log(`chunk vec:\n${result1}`);

	console.log(`num chunks returned ${result1.length}`);

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
function generateRandomData(sizeInMB: number): Uint8Array {
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
	return view;
}
