import { isNil } from "lodash";
import { DB } from "../controllers/db-controller";
import { ICategoryData } from "../interfaces/category-interface";

export class CategoriesService {

    public createCategory(categoryName: ICategoryData): void {
        const isCategoryNameTaken = !isNil(this.getCategoryByName(categoryName));
        const categoryToSave = new DB.Models.Category(categoryName);

        if (categoryName.name === '') {
            throw new Error('Category name must not be empty');
        }

        if (isCategoryNameTaken) {
            throw new Error('Such category already esists');
        }

        categoryToSave.save((err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
    
    public async getAllCategories(): Promise<ICategoryData[]> {
        return await DB.Models.Category.find({ });
    }

    private async getCategoryByName(categoryName: ICategoryData): Promise<ICategoryData | null> {
        return await DB.Models.Category.findOne(categoryName);
    }
}