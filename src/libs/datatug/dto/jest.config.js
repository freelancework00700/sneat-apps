module.exports = {
	displayName: 'datatug-dto',
	preset: '../../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.(html|svg)$',
		},
	},
	coverageDirectory: '../../../coverage/libs/datatug/dto',
	snapshotSerializers: [
		'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
		'jest-preset-angular/build/AngularSnapshotSerializer.js',
		'jest-preset-angular/build/HTMLCommentSerializer.js',
	],
	transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
