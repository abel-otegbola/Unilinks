import { useParams } from "react-router-dom";

function SingleLinkPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="flex flex-col max-w-[800px] mx-auto 2xl:gap-8 md:gap-6 gap-4 2xl:p-12 md:p-10 p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap py-4 border-b border-gray-500/[0.1]">
                <h1 className="md:text-[18px] text-[16px] font-medium capitalize leading-[28px]">Payment link</h1>
                <p> #{id}</p>
            </div>
        </div>
    )
}

export default SingleLinkPage