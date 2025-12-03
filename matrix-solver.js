// Matrix Solver Component
        const MatrixSolver = () => {
            // State management
            const [theme, setTheme] = React.useState("light");
            const [rowsA, setRowsA] = React.useState(2);
            const [colsA, setColsA] = React.useState(2);
            const [rowsB, setRowsB] = React.useState(2);
            const [colsB, setColsB] = React.useState(2);
            const [matrixA, setMatrixA] = React.useState([[0, 0], [0, 0]]);
            const [matrixB, setMatrixB] = React.useState([[0, 0], [0, 0]]);
            const [operation, setOperation] = React.useState("add");
            const [result, setResult] = React.useState([]);
            const [error, setError] = React.useState(null);
            const [showResult, setShowResult] = React.useState(false);

            // Initialize matrices when dimensions change
            React.useEffect(() => {
                initializeMatrixA();
                initializeMatrixB();
            }, [rowsA, colsA, rowsB, colsB]);

            // Theme management
            React.useEffect(() => {
                const savedTheme = localStorage.getItem("matrix-solver-theme");
                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    setTheme(prefersDark ? "dark" : "light");
                }
            }, []);

            React.useEffect(() => {
                localStorage.setItem("matrix-solver-theme", theme);
                document.documentElement.classList.toggle("dark", theme === "dark");
            }, [theme]);

            const initializeMatrixA = () => {
                const newMatrix = Array(rowsA).fill(null).map(() => Array(colsA).fill(0));
                setMatrixA(newMatrix);
            };

            const initializeMatrixB = () => {
                const newMatrix = Array(rowsB).fill(null).map(() => Array(colsB).fill(0));
                setMatrixB(newMatrix);
            };

            const handleMatrixAChange = (row, col, value) => {
                const numValue = parseFloat(value) || 0;
                const newMatrix = [...matrixA];
                newMatrix[row][col] = numValue;
                setMatrixA(newMatrix);
            };

            const handleMatrixBChange = (row, col, value) => {
                const numValue = parseFloat(value) || 0;
                const newMatrix = [...matrixB];
                newMatrix[row][col] = numValue;
                setMatrixB(newMatrix);
            };

            const validateOperation = () => {
                setError(null);
                
                if (operation === "add" || operation === "subtract") {
                    if (rowsA !== rowsB || colsA !== colsB) {
                        setError("For addition and subtraction, both matrices must have the same dimensions");
                        return false;
                    }
                } else if (operation === "multiply") {
                    if (colsA !== rowsB) {
                        setError(`For multiplication, columns of first matrix (${colsA}) must equal rows of second matrix (${rowsB})`);
                        return false;
                    }
                }
                
                return true;
            };

            const calculateResult = () => {
                if (!validateOperation()) return;

                let newResult = [];

                try {
                    switch (operation) {
                        case "add":
                            newResult = matrixA.map((row, i) => 
                                row.map((val, j) => val + matrixB[i][j])
                            );
                            break;
                        
                        case "subtract":
                            newResult = matrixA.map((row, i) => 
                                row.map((val, j) => val - matrixB[i][j])
                            );
                            break;
                        
                        case "multiply":
                            newResult = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));
                            for (let i = 0; i < rowsA; i++) {
                                for (let j = 0; j < colsB; j++) {
                                    for (let k = 0; k < colsA; k++) {
                                        newResult[i][j] += matrixA[i][k] * matrixB[k][j];
                                    }
                                }
                            }
                            break;
                        
                        case "scalar":
                            const scalar = matrixB[0][0] || 0;
                            newResult = matrixA.map(row => 
                                row.map(val => val * scalar)
                            );
                            break;
                    }
                    
                    setResult(newResult);
                    setShowResult(true);
                } catch (err) {
                    setError("An error occurred during calculation");
                }
            };

            const clearAll = () => {
                initializeMatrixA();
                initializeMatrixB();
                setResult([]);
                setShowResult(false);
                setError(null);
            };

            const toggleTheme = () => {
                setTheme(theme === "light" ? "dark" : "light");
            };

            const formatNumber = (num) => {
                return num.toFixed(2);
            };

            // Simple Select component
            const Select = ({ value, onValueChange, children }) => {
                return React.createElement('select', {
                    value,
                    onChange: (e) => onValueChange(e.target.value),
                    className: 'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                }, children);
            };

            // Simple SelectItem component
            const SelectItem = ({ value, children }) => {
                return React.createElement('option', { value }, children);
            };

            // Simple Button component
            const Button = ({ onClick, children, variant = "default", className = "" }) => {
                const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
                const variantClasses = {
                    default: "bg-blue-600 text-white hover:bg-blue-700",
                    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700",
                    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                };
                
                return React.createElement('button', {
                    onClick,
                    className: `${baseClasses} ${variantClasses[variant]} ${className}`
                }, children);
            };

            // Simple Card components
            const Card = ({ children, className = "" }) => {
                return React.createElement('div', {
                    className: `bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`
                }, children);
            };

            const CardHeader = ({ children, className = "" }) => {
                return React.createElement('div', {
                    className: `p-6 border-b border-gray-200 dark:border-gray-700 ${className}`
                }, children);
            };

            const CardContent = ({ children, className = "" }) => {
                return React.createElement('div', {
                    className: `p-6 ${className}`
                }, children);
            };

            const CardTitle = ({ children, className = "" }) => {
                return React.createElement('h3', {
                    className: `text-lg font-semibold ${className}`
                }, children);
            };

            // Simple Label component
            const Label = ({ htmlFor, children }) => {
                return React.createElement('label', {
                    htmlFor,
                    className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                }, children);
            };

            return React.createElement('div', {
                className: `min-h-screen transition-colors duration-200 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`
            }, React.createElement('div', {
                className: "container mx-auto px-4 py-8 max-w-6xl"
            },
                // Header
                React.createElement('div', {
                    className: "flex items-center justify-between mb-8"
                },
                    React.createElement('div', {
                        className: "flex items-center gap-3"
                    },
                        React.createElement('div', {
                            className: "h-8 w-8 text-blue-600"
                        }, "🧮"),
                        React.createElement('h1', {
                            className: "text-3xl font-bold"
                        }, "Matrix Solver")
                    ),
                    React.createElement(Button, {
                        onClick: toggleTheme,
                        variant: "outline",
                        className: "flex items-center gap-2"
                    },
                        theme === "light" ? "🌙" : "☀️",
                        theme === "light" ? "Dark Mode" : "Light Mode"
                    )
                ),

                // Instructions
                React.createElement(Card, {
                    className: "mb-8"
                },
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "How to Use")
                    ),
                    React.createElement(CardContent, null,
                        React.createElement('p', {
                            className: "text-sm opacity-75"
                        },
                            "1. Set the dimensions for both matrices (1-5 rows/cols)\\n2. Enter numeric values into the matrix cells\\n3. Select an operation (add, subtract, multiply, or scalar)\\n4. Click \"Calculate\" to see the result\\n5. Use \"Clear All\" to reset everything"
                        )
                    )
                ),

                // Controls
                React.createElement('div', {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                },
                    // Matrix A Dimensions
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, {
                                className: "text-lg"
                            }, "Matrix A Dimensions")
                        ),
                        React.createElement(CardContent, {
                            className: "space-y-4"
                        },
                            React.createElement('div', null,
                                React.createElement(Label, {
                                    htmlFor: "rowsA"
                                }, "Rows"),
                                React.createElement(Select, {
                                    value: rowsA.toString(),
                                    onValueChange: (v) => setRowsA(parseInt(v))
                                },
                                    [1, 2, 3, 4, 5].map(num => 
                                        React.createElement(SelectItem, {
                                            key: num,
                                            value: num.toString()
                                        }, num)
                                    )
                                )
                            ),
                            React.createElement('div', null,
                                React.createElement(Label, {
                                    htmlFor: "colsA"
                                }, "Columns"),
                                React.createElement(Select, {
                                    value: colsA.toString(),
                                    onValueChange: (v) => setColsA(parseInt(v))
                                },
                                    [1, 2, 3, 4, 5].map(num => 
                                        React.createElement(SelectItem, {
                                            key: num,
                                            value: num.toString()
                                        }, num)
                                    )
                                )
                            )
                        )
                    ),

                    // Matrix B Dimensions
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, {
                                className: "text-lg"
                            }, "Matrix B Dimensions")
                        ),
                        React.createElement(CardContent, {
                            className: "space-y-4"
                        },
                            React.createElement('div', null,
                                React.createElement(Label, {
                                    htmlFor: "rowsB"
                                }, "Rows"),
                                React.createElement(Select, {
                                    value: rowsB.toString(),
                                    onValueChange: (v) => setRowsB(parseInt(v))
                                },
                                    [1, 2, 3, 4, 5].map(num => 
                                        React.createElement(SelectItem, {
                                            key: num,
                                            value: num.toString()
                                        }, num)
                                    )
                                )
                            ),
                            React.createElement('div', null,
                                React.createElement(Label, {
                                    htmlFor: "colsB"
                                }, "Columns"),
                                React.createElement(Select, {
                                    value: colsB.toString(),
                                    onValueChange: (v) => setColsB(parseInt(v))
                                },
                                    [1, 2, 3, 4, 5].map(num => 
                                        React.createElement(SelectItem, {
                                            key: num,
                                            value: num.toString()
                                        }, num)
                                    )
                                )
                            )
                        )
                    ),

                    // Operation Selector
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, {
                                className: "text-lg"
                            }, "Operation")
                        ),
                        React.createElement(CardContent, null,
                            React.createElement(Select, {
                                value: operation,
                                onValueChange: (v) => setOperation(v)
                            },
                                React.createElement(SelectItem, {
                                    value: "add"
                                }, "Addition (A + B)"),
                                React.createElement(SelectItem, {
                                    value: "subtract"
                                }, "Subtraction (A - B)"),
                                React.createElement(SelectItem, {
                                    value: "multiply"
                                }, "Multiplication (A × B)"),
                                React.createElement(SelectItem, {
                                    value: "scalar"
                                }, "Scalar Multiplication (A × scalar)")
                            )
                        )
                    ),

                    // Action Buttons
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, {
                                className: "text-lg"
                            }, "Actions")
                        ),
                        React.createElement(CardContent, {
                            className: "space-y-3"
                        },
                            React.createElement(Button, {
                                onClick: calculateResult,
                                className: "w-full"
                            }, "Calculate"),
                            React.createElement(Button, {
                                onClick: clearAll,
                                variant: "outline",
                                className: "w-full flex items-center gap-2"
                            },
                                "✖",
                                "Clear All"
                            )
                        )
                    )
                ),

                // Error Display
                error && React.createElement(Card, {
                    className: "mb-8 border-red-500"
                },
                    React.createElement(CardContent, {
                        className: "pt-6"
                    },
                        React.createElement('p', {
                            className: "text-red-700 font-medium"
                        }, error)
                    )
                ),

                // Matrix Inputs
                React.createElement('div', {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                },
                    // Matrix A
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, null, "Matrix A")
                        ),
                        React.createElement(CardContent, null,
                            React.createElement('div', {
                                className: "inline-block"
                            },
                                matrixA.map((row, i) => 
                                    React.createElement('div', {
                                        key: `row-${i}`,
                                        className: "flex gap-2 mb-2 last:mb-0"
                                    },
                                        row.map((value, j) => 
                                            React.createElement('input', {
                                                key: `cell-${i}-${j}`,
                                                type: "number",
                                                value: value,
                                                onChange: (e) => handleMatrixAChange(i, j, e.target.value),
                                                className: `matrix-input ${theme === "dark" ? "dark" : ""}`,
                                                style: {
                                                    width: "4rem",
                                                    height: "4rem"
                                                }
                                            })
                                        )
                                    )
                                )
                            )
                        )
                    ),

                    // Matrix B
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, null, "Matrix B")
                        ),
                        React.createElement(CardContent, null,
                            React.createElement('div', {
                                className: "inline-block"
                            },
                                matrixB.map((row, i) => 
                                    React.createElement('div', {
                                        key: `row-${i}`,
                                        className: "flex gap-2 mb-2 last:mb-0"
                                    },
                                        row.map((value, j) => 
                                            React.createElement('input', {
                                                key: `cell-${i}-${j}`,
                                                type: "number",
                                                value: value,
                                                onChange: (e) => handleMatrixBChange(i, j, e.target.value),
                                                className: `matrix-input ${theme === "dark" ? "dark" : ""}`,
                                                style: {
                                                    width: "4rem",
                                                    height: "4rem"
                                                }
                                            })
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),

                // Result Display
                showResult && result.length > 0 && React.createElement(Card, null,
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Result")
                    ),
                    React.createElement(CardContent, null,
                        React.createElement('div', {
                            className: "inline-block"
                        },
                            result.map((row, i) => 
                                React.createElement('div', {
                                    key: `result-row-${i}`,
                                    className: "flex gap-2 mb-2 last:mb-0"
                                },
                                    row.map((value, j) => 
                                        React.createElement('div', {
                                            key: `result-cell-${i}-${j}`,
                                            className: `matrix-result ${theme === "dark" ? "dark" : "light"}`,
                                            style: {
                                                width: "4rem",
                                                height: "4rem"
                                            }
                                        },
                                            formatNumber(value)
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            ));
        };

        // Render the app
        ReactDOM.render(React.createElement(MatrixSolver), document.getElementById('root'));