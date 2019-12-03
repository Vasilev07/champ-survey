import { DB } from "../controllers/db-controller";
import { ICategoryData } from "../interfaces/category-interface";

export class CategoriesService {

    public createCategory(categoryName: ICategoryData): void {
        const categoryToSave = new DB.Models.Category(categoryName);

        categoryToSave.save((err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
    
    public async getAllCategories(): Promise<ICategoryData[]> {
        return await DB.Models.Category.find({ });
    }
}