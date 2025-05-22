import { Chunker } from '../../../../hf/xet-core/chunker-wasm/pkg/chunker_wasm';

const DEFAULT_SIZE_IN_MB = 20;
const TARGET_CHUNK_SIZE_IN_BYTES = 64 * 1024;
const MB_TO_BYTES = 1024 * 1024;
const DEFAULT_INGESTION_SIZE_IN_BYTES = 1 * MB_TO_BYTES; // arbitrary

export async function callMe() {
	const buffer = generateRandomData(DEFAULT_SIZE_IN_MB);

	const chunker = new Chunker(TARGET_CHUNK_SIZE_IN_BYTES);

	const ingestion_size = DEFAULT_INGESTION_SIZE_IN_BYTES;
	for (let i = 0; i < buffer.length; i += ingestion_size) {
		const slice = buffer.slice(i, i + ingestion_size);
		const chunk_info = chunker.add_data(slice);
		for (const chunk of chunk_info) {
			console.log(`chunk: ${chunk}, hash: ${chunk.hash}, length: ${chunk.length}`);
		}
	}
	const chunk_info = chunker.finish();
	for (const chunk of chunk_info) {
		console.log(`chunk: ${chunk}, hash: ${chunk.hash}, length: ${chunk.length}`);
	}
	console.log('done');
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
