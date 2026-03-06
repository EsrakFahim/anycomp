import { Button } from "../../../../Components/Button/Button";

interface DeleteSpecialistModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export const DeleteSpecialistModal = ({ isOpen, onCancel, onConfirm }: DeleteSpecialistModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6 mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this specialist? This action cannot be undone.
                </p>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="px-4 py-2 w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-error text-white hover:bg-error/90 px-4 py-2 w-full sm:w-auto"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};
