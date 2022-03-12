class WhereClause {
	constructor(base, bigQ) {
		this.base = base;
		this.bigQ = bigQ;
	}

	search() {
		const searchWord = this.bigQ.search
			? {
					name: {
						$regex: this.bigQ.search,
						$options: "i",
					},
			  }
			: {};

		this.base = this.base.find({ ...searchWord });
		return this;
	}

	pager(resultPerPage) {
		let currentPage = 1;

		//update if present
		if (this.bigQ.page) {
			currentPage = this.bigQ.page;
		}

		this.base = this.base.limit(resultPerPage).skip((currentPage - 1) * resultPerPage);
		return this;
	}

	filter() {
		let copyQ = { ...this.bigQ };

		delete copyQ["search"];
		delete copyQ["page"];
		delete copyQ["limit"];

		//Conver CopyQ to string and append $ for operation
		copyQ = JSON.parse(JSON.stringify(copyQ).replace(/\b(gt|lt|gte|lte)\b/g, (word) => `$${word}`));

		this.base = this.base.find({ ...copyQ });
		return this;
	}
}

module.exports = WhereClause;
