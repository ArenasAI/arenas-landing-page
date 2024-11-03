# Import necessary packages
using DataFrames
using CSV
using Statistics

# Load data from a CSV file
function load_data(file_path::String)
    return CSV.File(file_path) |> DataFrame
end

# Summarize the data
function summarize_data(df::DataFrame)
    println("Data Summary:")
    println("Number of rows: ", nrow(df))
    println("Number of columns: ", ncol(df))
    println("Column names: ", names(df))
    
    # Show the first few rows of the data
    println("\nFirst few rows of the dataset:")
    display(first(df, 5))
end

# Perform basic statistical analysis
function analyze_data(df::DataFrame)
    println("\nStatistical Analysis:")
    
    # Calculate means of numeric columns
    means = mean.(eachcol(df)
                .|> x -> isa(x, AbstractVector) ? mean(x) : missing)
    
    for (col_name, mean_value) in zip(names(df), means)
        println("Mean of $col_name: $mean_value")
    end
end

# Main function
function main()
    # Specify the path to your CSV file
    file_path = "data.csv"  # Replace with your actual file path
    
    # Load the data
    df = load_data(file_path)
    
    # Summarize the data
    summarize_data(df)
    
    # Analyze the data
    analyze_data(df)
end

# Run the main function
main()
