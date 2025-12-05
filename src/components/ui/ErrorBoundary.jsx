import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-red-500/30">
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-500/20 p-4 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center mb-4">Oups ! Une erreur est survenue</h2>

                        <p className="text-gray-400 text-center mb-6">
                            Le jeu a rencontré un problème inattendu. Ne vous inquiétez pas, votre progression est sauvegardée.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-black/50 p-4 rounded-lg mb-6 overflow-auto max-h-40 text-xs font-mono text-red-300">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Recharger le jeu
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
