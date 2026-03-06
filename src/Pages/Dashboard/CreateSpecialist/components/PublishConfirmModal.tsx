import { Info } from "lucide-react";
import { Button } from "../../../../Components/Button/Button";

interface PublishConfirmModalProps {
    showPublishModal: boolean;
    setShowPublishModal: (show: boolean) => void;
    confirmPublish: () => void;
    isLoadingSubmit: boolean;
}

export const PublishConfirmModal = ({
    showPublishModal,
    setShowPublishModal,
    confirmPublish,
    isLoadingSubmit,
}: PublishConfirmModalProps) => {
    if (!showPublishModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
                onClick={() => setShowPublishModal(false)}
            />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl p-6 mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Info /> Publish Changes
                </h3>
                <p className="text-sm text-gray-600 mb-6 whitespace-nowrap">
                    Do you want to publish these changes? It will appear in the marketplace listing.
                </p>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowPublishModal(false)}
                        className="bg-secondary text-white px-10 py-5"
                    >
                        Continue Editing
                    </Button>
                    <Button
                        onClick={confirmPublish}
                        className="bg-primary text-white hover:bg-primary/90 px-10 py-5"
                        disabled={isLoadingSubmit}
                    >
                        Publish
                    </Button>
                </div>
            </div>
        </div>
    );
};
