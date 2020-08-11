/**
 * Utility class used to assist with operations on Account objects
 */
class AccountHelper {
    _logger;

    constructor(logger) {
        this._logger = logger;
    }

    /**
     * Massages the provided array of accounts to better interact with the frontend
     * @param {Array} accountList array of Account objects to be massaged
     */
    massageAccounts(accountList) {
        accountList.forEach(account => {
            if (typeof account.amount !== 'undefined') {
                account.account = parseFloat(account.amount, 10);
            }
        });

        return accountList;
    }

    /**
     * Merges the provided account into the provided array, replacing it if it aready exists
     * IF the account doesn't exist, no action is taken
     * @param {Account} accountToMerge The account to be merged into the array
     * @param {Array} accountsArray The array to merge the account into
     */
    async mergeAccountIntoArray(accountToMerge, accountsArray) {
        let index = accountsArray.findIndex(account => {
            return account.id === accountToMerge.id;
        });

        if (index >= 0) {
            this._logger.debug('found the index: ' + index);
            accountsArray.splice(index, 1, accountToMerge);
        }
        else {
            this._logger.warn('failed to find the index in the array for account: ' + JSON.stringify(accountToMerge));
        }

        return accountsArray;
    }
}

export default AccountHelper;