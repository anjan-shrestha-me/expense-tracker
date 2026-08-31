const Transaction = require("../models/Transaction");

//for creating a new transaction
const createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction({
            ...req.body,
            userId: req.user.userId
        });

        await transaction.save();

        res.status(201).json({
            message: "Transaction saved",
            data: transaction
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to save transaction",
            error: error.message
        });
    }
};


//for getting all transaction for a user

const getTransactions = async(req,res)=>{
    try{
        const transactions = await Transaction.find({userId:req.user.userId});
        res.status(200).json({
            message: "Transactions found",
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
}

//for updating a transaction

const updateTransaction = async (req ,res)=>{
    try{
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            req.body,
            {new:true}
        );
        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }
        res.json({
            message: "Transaction updated",
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update transaction",
            error: error.message
        });
    }
}

// deleting a transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            message: "Transaction deleted",
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete transaction",
            error: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};          
