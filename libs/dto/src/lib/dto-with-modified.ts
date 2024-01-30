export interface timestamp {
	seconds: number;
	nanoseconds: number;
}
export const emptyTimestamp: timestamp = { seconds: 0, nanoseconds: 0 };

export interface IWithCreatedShort {
	readonly on: string;
	readonly by: string;
}

export interface IWithCreatedOn {
	readonly createdOn: string;
}

export interface IWithCreated {
	readonly createdAt: timestamp;
	readonly createdBy: string;
}

export interface IWithUpdated {
	readonly updatedAt: timestamp;
	readonly updatedBy: string;
}

export interface IWithDeleted {
	readonly deletedAt?: timestamp;
	readonly deletedBy?: string;
}

export interface IWithModified
	extends IWithCreated,
		IWithUpdated,
		IWithDeleted {}
