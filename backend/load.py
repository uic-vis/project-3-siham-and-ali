import common_mods as cm
from clean import clean_data


def load_data(dir):
    current_dir = cm.os.path.abspath(cm.os.getcwd())
    parent_dir = cm.os.path.dirname(current_dir)
    dataset_dir = parent_dir + dir

    init_data = cm.pd.read_csv(dataset_dir)
    return init_data


if __name__ == "__main__":
    dir = "/Datasets/Assignment 3/raw_crimes.csv"
    data = load_data(dir)
    clean_data(data=data)
