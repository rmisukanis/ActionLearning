const assetResponseMock = {
    "Account": [
        {
            "Name": "Accounts Receivable (A/R)",
            "SubAccount": false,
            "FullyQualifiedName": "Accounts Receivable (A/R)",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Accounts Receivable",
            "AccountSubType": "AccountsReceivable",
            "CurrentBalance": 9585.52,
            "CurrentBalanceWithSubAccounts": 9585.52,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "84",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-12T14:49:29-07:00",
                "LastUpdatedTime": "2024-08-12T14:49:29-07:00"
            }
        },
        {
            "Name": "Checking",
            "SubAccount": false,
            "FullyQualifiedName": "Checking",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Bank",
            "AccountSubType": "Checking",
            "CurrentBalance": 57888.43,
            "CurrentBalanceWithSubAccounts": 57888.43,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "35",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-11T12:08:20-07:00",
                "LastUpdatedTime": "2024-08-11T12:08:20-07:00"
            }
        },
        {
            "Name": "Depreciation",
            "SubAccount": true,
            "ParentRef": {
                "value": "37"
            },
            "FullyQualifiedName": "Truck:Depreciation",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Fixed Asset",
            "AccountSubType": "AccumulatedDepreciation",
            "CurrentBalance": 0,
            "CurrentBalanceWithSubAccounts": 0,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "39",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-11T12:11:07-07:00",
                "LastUpdatedTime": "2024-08-11T12:11:07-07:00"
            }
        },
        {
            "Name": "Inventory Asset",
            "SubAccount": false,
            "FullyQualifiedName": "Inventory Asset",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Other Current Asset",
            "AccountSubType": "Inventory",
            "CurrentBalance": 596.25,
            "CurrentBalanceWithSubAccounts": 596.25,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "81",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-12T10:36:05-07:00",
                "LastUpdatedTime": "2024-08-12T10:36:05-07:00"
            }
        },
        {
            "Name": "JessChecking",
            "SubAccount": false,
            "Description": "JessChecking",
            "FullyQualifiedName": "JessChecking",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Bank",
            "AccountSubType": "Checking",
            "CurrentBalance": -35218.51,
            "CurrentBalanceWithSubAccounts": -35218.51,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "94",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2025-01-26T19:26:54-08:00",
                "LastUpdatedTime": "2025-01-26T19:26:54-08:00"
            }
        },
        {
            "Name": "MyJobs_test",
            "SubAccount": false,
            "FullyQualifiedName": "MyJobs_test",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Accounts Receivable",
            "AccountSubType": "AccountsReceivable",
            "CurrentBalance": 0,
            "CurrentBalanceWithSubAccounts": 0,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "91",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-09-10T03:13:54-07:00",
                "LastUpdatedTime": "2024-09-10T03:13:54-07:00"
            }
        },
        {
            "Name": "MyJobs_test ( 92 )",
            "SubAccount": false,
            "FullyQualifiedName": "MyJobs_test ( 92 )",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Accounts Receivable",
            "AccountSubType": "AccountsReceivable",
            "CurrentBalance": 0,
            "CurrentBalanceWithSubAccounts": 0,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "92",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-09-10T03:13:54-07:00",
                "LastUpdatedTime": "2024-10-02T02:39:29-07:00"
            }
        },
        {
            "Name": "Original Cost",
            "SubAccount": true,
            "ParentRef": {
                "value": "37"
            },
            "FullyQualifiedName": "Truck:Original Cost",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Fixed Asset",
            "AccountSubType": "Vehicles",
            "CurrentBalance": 13495,
            "CurrentBalanceWithSubAccounts": 13495,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "38",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-11T12:11:06-07:00",
                "LastUpdatedTime": "2024-08-11T12:11:06-07:00"
            }
        },
        {
            "Name": "Prepaid Expenses",
            "SubAccount": false,
            "FullyQualifiedName": "Prepaid Expenses",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Other Current Asset",
            "AccountSubType": "PrepaidExpenses",
            "CurrentBalance": 0,
            "CurrentBalanceWithSubAccounts": 0,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "3",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-07T14:42:07-07:00",
                "LastUpdatedTime": "2024-08-07T14:42:07-07:00"
            }
        },
        {
            "Name": "Savings",
            "SubAccount": false,
            "FullyQualifiedName": "Savings",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Bank",
            "AccountSubType": "Savings",
            "CurrentBalance": 2820,
            "CurrentBalanceWithSubAccounts": 2820,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "36",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-11T12:09:00-07:00",
                "LastUpdatedTime": "2024-08-11T12:09:00-07:00"
            }
        },
        {
            "Name": "Truck",
            "SubAccount": false,
            "FullyQualifiedName": "Truck",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Fixed Asset",
            "AccountSubType": "Vehicles",
            "CurrentBalance": 10000,
            "CurrentBalanceWithSubAccounts": 23495,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "37",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-11T12:11:06-07:00",
                "LastUpdatedTime": "2024-08-11T12:11:07-07:00"
            }
        },
        {
            "Name": "Uncategorized Asset",
            "SubAccount": false,
            "FullyQualifiedName": "Uncategorized Asset",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Other Current Asset",
            "AccountSubType": "OtherCurrentAssets",
            "CurrentBalance": 0,
            "CurrentBalanceWithSubAccounts": 0,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "32",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-07T14:46:30-07:00",
                "LastUpdatedTime": "2024-08-07T14:46:30-07:00"
            }
        },
        {
            "Name": "Undeposited Funds",
            "SubAccount": false,
            "FullyQualifiedName": "Undeposited Funds",
            "Active": true,
            "Classification": "Asset",
            "AccountType": "Other Current Asset",
            "AccountSubType": "UndepositedFunds",
            "CurrentBalance": 4380.52,
            "CurrentBalanceWithSubAccounts": 4380.52,
            "CurrencyRef": {
                "value": "USD",
                "name": "United States Dollar"
            },
            "domain": "QBO",
            "sparse": false,
            "Id": "4",
            "SyncToken": "0",
            "MetaData": {
                "CreateTime": "2024-08-07T14:42:07-07:00",
                "LastUpdatedTime": "2024-08-07T14:42:07-07:00"
            }
        }
    ]
}
export const getAssets = async () => {
    return await assetResponseMock;
}