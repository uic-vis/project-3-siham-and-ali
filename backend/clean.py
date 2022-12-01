import common_mods as cm


def clean_data(data, type_=None):
    init_data = preprocess_data(data)
    subset_data = get_subset(init_data, 2016, 2023)

    if type_ is None:
        cleaned_data_1 = clean_theft(subset_data)
        cleaned_data_2 = clean_narcotics(subset_data)
        cleaned_data_3 = clean_weapons(subset_data)
        cleaned_data_4 = clean_kidnapping(subset_data)
        cleaned_data_5 = clean_sexual_assault(subset_data)
        frames = [cleaned_data_1, cleaned_data_2, cleaned_data_3,
                  cleaned_data_4, cleaned_data_5]
        result = cm.pd.concat(frames)
        print(result.value_counts(['Primary Type', 'Description']))

        save_data_json("Total", columns_update(result))

    if type_ == "Theft":
        cleaned_data = clean_theft(subset_data)
        save_data_json(type_, columns_update(cleaned_data))

    if type_ == "Narcotics":
        cleaned_data = clean_narcotics(subset_data)
        save_data_json(type_, columns_update(cleaned_data))

    if type_ == "Weapons":
        cleaned_data = clean_weapons(subset_data)
        save_data_json(type_, columns_update(cleaned_data))    

    if type_ == "Kidnapping":
        cleaned_data = clean_kidnapping(subset_data)
        save_data_json(type_, columns_update(cleaned_data))

    if type_ == "Sexual Assault":
        cleaned_data = clean_sexual_assault(subset_data)
        save_data_json(type_, columns_update(cleaned_data))


def preprocess_data(init_data):
    # CLEAN ADDRESS DURING PREPROCESSING
    current_dir = cm.os.path.abspath(cm.os.getcwd())
    parent_dir = cm.os.path.dirname(current_dir)
    dir = "/Datasets/Assignment 3/init_crimes.csv"

    if cm.os.path.exists(parent_dir + dir):
        init_data = cm.pd.read_csv(parent_dir + dir)
        print("Exists")
        return init_data

    init_data = drop_excess_cols(init_data)
    init_data = remove_null_values(init_data)
    init_data = clean_date_time(init_data)
    init_data = clean_address(init_data)
    init_data.to_csv(parent_dir + dir, index=False)

    return init_data


def drop_excess_cols(init_data):
    init_data.drop(columns=['ID', 'Case Number'], inplace=True)
    init_data.drop(columns=['IUCR'], inplace=True)
    init_data.drop(columns=['Location Description', 'Location'], inplace=True)
    init_data.drop(columns=['Domestic'], inplace=True)
    init_data.drop(columns=['FBI Code'], inplace=True)
    init_data.drop(columns=['Year', 'Updated On'], inplace=True)
    init_data.drop(columns=['Arrest', 'Beat', 'District', 'Ward'], inplace=True)
    init_data.drop(columns=['X Coordinate', 'Y Coordinate'], inplace=True)

    return init_data


def remove_null_values(init_data):
    init_data.dropna(axis=0, inplace=True)

    return init_data


def clean_date_time(init_data):
    init_data[['Date', 'Time']] = init_data['Date'].str.split(n=1, expand=True)
    init_data['Date'] = cm.pd.to_datetime(init_data['Date'])

    init_data['Day'] = init_data['Date'].dt.day
    init_data['Month'] = init_data['Date'].dt.month_name()
    init_data['Year'] = init_data['Date'].dt.year

    init_data.drop(columns=['Date'], inplace=True)

    init_data['Time'] = cm.pd.to_datetime(init_data['Time'], format='%I:%M:%S %p').dt.strftime('%H:%M')

    return init_data


def get_subset(init_data, year_1=2017, year_2=2022):
    months = ["January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December"]

    crimes_sub = init_data.loc[(init_data['Year'] > year_1) & (init_data['Year'] < year_2)]
    cm.pd.set_option('display.max_columns', None)
    crimes_sub.sort_values(by='Month', key=lambda x: cm.pd.Categorical(x, categories=months, ordered=True), inplace=True)

    return crimes_sub


def clean_theft(init_data):
    init_data[init_data['Primary Type'].str.contains('THEFT')].value_counts(['Primary Type', 'Description'])

    init_data.loc[init_data['Primary Type'].str.contains('THEFT'), 'Primary Type'] = 'THEFT'
    theft_data = init_data.loc[init_data['Primary Type'] == 'THEFT']

    theft_data.loc[theft_data['Description'].str.contains('ATTEMPT|ATT'), 'Description'] = 'ATTEMPTED THEFT'
    theft_data.loc[theft_data['Description'].str.contains('\$|FINANCIAL|COIN'), 'Description'] = 'MONEY'
    theft_data.loc[theft_data['Description'].str.contains('AUTOMOBILE|BUS|SCOOTER|BIKE'), 'Description'] = 'AUTOMOBILES'
    theft_data.loc[theft_data['Description'].str.contains('AUTOMOBILE|BUS|SCOOTER|BIKE'), 'Description'] = 'AUTOMOBILES'
    theft_data.loc[theft_data['Description'].str.contains('RETAIL'), 'Description'] = 'RETAIL THEFT'

    return theft_data


def clean_narcotics(init_data):
    init_data[init_data['Primary Type'].str.contains('NARCOTIC')].value_counts(['Primary Type', 'Description'])

    init_data.loc[init_data['Primary Type'].str.contains('NARCOTICS|OTHER NARCOTICS'), 'Primary Type'] = 'NARCOTICS'
    narcotics_data = init_data.loc[init_data['Primary Type'] == 'NARCOTICS']

    narcotics_data.loc[narcotics_data['Description'].str.contains('ATTE'), 'Description'] = 'ATTEMPTED POSSESSION'
    narcotics_data.loc[narcotics_data['Description'].str.contains('POS') &
                       ~narcotics_data['Description'].str.contains('ATTEMPTED|EQUIP'), 'Description'] = 'POSSESSION OF DRUGS'
    narcotics_data.loc[narcotics_data['Description'].str.contains('MANU|DEL'), 'Description'] = 'MANUFACTURE / DELIVERY OF DRUGS '
    narcotics_data.loc[narcotics_data['Description'].str.contains('SOLICIT'), 'Description'] = 'SOLICITATION OF DRUGS'
    narcotics_data.loc[narcotics_data['Description'].str.contains('CONSPIRACY'), 'Description'] = 'DRUG CONSPIRACY'
    narcotics_data.loc[narcotics_data['Description'].str.contains('FORGE'), 'Description'] = 'ALTERED / FORGED PRESCRIPTION'

    return narcotics_data


def clean_weapons(init_data):
    init_data[init_data['Primary Type'].str.contains('WEAPONS')].value_counts(['Primary Type', 'Description'])

    weapons_data = init_data.loc[init_data['Primary Type'] == 'WEAPONS VIOLATION']

    weapons_data.loc[weapons_data['Description'].str.contains('UNLAWFUL POSS'), 'Description'] = 'UNLAWFUL POSSESSION'
    weapons_data.loc[weapons_data['Description'].str.contains('UNLAWFUL USE'), 'Description'] = 'UNLAWFUL USE'
    weapons_data.loc[weapons_data['Description'].str.contains('UNLAWFUL SALE'), 'Description'] = 'UNLAWFUL SALE'
    weapons_data.loc[weapons_data['Description'].str.contains('DEFACE'), 'Description'] = 'DEFACE IDENTIFICATION MARKS'
    weapons_data.loc[weapons_data['Description'].str.contains('FOID'), 'Description'] = 'NO FOID CARD'

    return weapons_data


def clean_kidnapping(init_data):
    init_data[init_data['Primary Type'].str.contains('KIDNAPPING')].value_counts(['Primary Type', 'Description'])

    kidnapping_data = init_data.loc[init_data['Primary Type'] == 'KIDNAPPING']

    kidnapping_data.loc[kidnapping_data['Description'].str.contains('CHILD'), 'Description'] = 'CHILD ABDUCTION'
    kidnapping_data.loc[kidnapping_data['Description'].str.contains('VISITATION'), 'Description'] = 'UNLAWFUL VISITATION'
    kidnapping_data.loc[kidnapping_data['Description'].str.contains('DETENTION'), 'Description'] = 'UNLAWFUL RESTRAINT'

    return kidnapping_data


def clean_sexual_assault(init_data):
    init_data[init_data['Primary Type'].str.contains('SEXUAL')].value_counts(['Primary Type', 'Description'])

    init_data.loc[init_data['Primary Type'].str.contains('SEXUAL'), 'Primary Type'] = 'SEXUAL ASSAULT'
    sex_assault_data = init_data.loc[init_data['Primary Type'] == 'SEXUAL ASSAULT']

    sex_assault_data.loc[sex_assault_data['Description'].str.contains('ATTEMPT'), 'Description'] = 'ATTEMPTED'
    sex_assault_data.loc[sex_assault_data['Description'].str.contains('AGG') &
                         ~sex_assault_data['Description'].str.contains('NON|OTHER'), 'Description'] = 'AGGRAVATED: WEAPON'
    sex_assault_data.loc[sex_assault_data['Description'].str.contains('WEAPON|FIREARM'), 'Description'] = 'AGGRAVATED: WEAPON'
    sex_assault_data.loc[sex_assault_data['Description'].str.contains('OTHER'), 'Description'] = 'AGGRAVATED: OTHER'

    return sex_assault_data


def clean_address(init_data):
    return init_data


def columns_update(init_data):
    rearranged_cols = ['Month', 'Day', 'Year', 'Time', 'Primary Type', 'Description',
                       'Block', 'Community Area', 'Latitude', 'Longitude']

    init_data = init_data[rearranged_cols]
    init_data.reset_index(inplace=True, drop=True)
    return init_data


def save_data_json(type_, clean_data):
    current_dir = cm.os.path.abspath(cm.os.getcwd())
    dir = "/" + type_ + ".json"

    clean_data.to_json(current_dir + dir, orient='records')


def count_data(data):
    vc = data.value_counts(['Primary Type', 'Description'])

    return vc
