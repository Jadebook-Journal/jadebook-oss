export type ActionResult =
	| {
			success: true;
	  }
	| {
			success: false;
			reason: string;
	  };

/** All actions that return data, must have this type */
export type ActionResultData<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			reason: string;
	  };
