import { formatNumber } from "../../../../lib/formatNumber";

interface SpecialistCardProps {
    specialist: any;
}

export const SpecialistCard = ({ specialist }: SpecialistCardProps) => {
    return (
        <div className="rounded-lg overflow-hidden">
            {/* Image Container - fixed aspect ratio */}
            <div className="aspect-square overflow-hidden">
                <img
                    src={specialist?.media?.[0]?.file_name || "https://via.placeholder.com/400x400?text=No+Image"}
                    alt={specialist.title}
                    className="w-full h-full object-cover rounded-md"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {specialist.title}
                </h3>
                <p className="text-sm text-textSecondary mb-3 line-clamp-2">
                    {specialist.description || "No description provided."}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-light text-primary">
                        RM {formatNumber(specialist.final_price || 0)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {specialist.duration_days} {specialist.duration_days === 1 ? "day" : "days"}
                    </span>
                </div>
            </div>
        </div>
    );
};
