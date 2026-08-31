function TransactionFilters({search,setSearch,type,setType,category,setCategory,date,setDate,sort,setSort,})  {
    const incomeCategories = [
        "Salary",
        "Freelance",
        "Investment",
        "Gift",
        "Other Income",
    ];

    const expenseCategories = [
        "Food",
        "Rent",
        "Transport",
        "Shopping",
        "Bills",
        "Entertainment",
        "Health",
        "Education",
        "Travel",
        "Others",
    ];
    let categories = [];

    if (type === "Income") {
        categories = incomeCategories;
    } else if (type === "Expense") {
        categories = expenseCategories;
    }
    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">

            <h2 className="text-2xl font-bold mb-6">
                Filters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Search */}

                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Type */}

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border rounded-lg p-3"
                >
                    <option>All Types</option>
                    <option>Income</option>
                    <option>Expense</option>
                </select>

                {/* Category */}

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded-lg p-3"
                >
                    <option>All Categories</option>

                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                {/* Date */}

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded-lg p-3"
                />

                {/* Sort */}

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border rounded-lg p-3"
                >
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Highest Amount</option>
                    <option>Lowest Amount</option>
                </select>

            </div>

            {/* Temporary */}

            <div className="mt-6 border-t pt-4">

                <p>
                    Search : <strong>{search}</strong>
                </p>

                <p>
                    Type : <strong>{type}</strong>
                </p>

                <p>
                    Category : <strong>{category}</strong>
                </p>

                <p>
                    Date : <strong>{date}</strong>
                </p>

                <p>
                    Sort : <strong>{sort}</strong>
                </p>

            </div>

        </div>
    );
}

export default TransactionFilters;