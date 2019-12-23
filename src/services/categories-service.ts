import { isNil } from "lodash";
import { DB } from "../controllers/db-controller";
import { ICategoryData } from "../interfaces/category-interface";

export class CategoriesService {

    public async createCategory(categoryName: ICategoryData): Promise<void> {
        const isCategoryNameTaken = !isNil(await this.getCategoryByName(categoryName));
        const categoryToSave = new DB.Models.Category(categoryName);

        if (categoryName.name === '') {
            throw new Error('Category name must not be empty');
        }

        if (isCategoryNameTaken) {
            throw new Error('Such category already esists');
        }

        await categoryToSave.save((err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
    
    public async getAllCategories(): Promise<ICategoryData[]> {
        return await DB.Models.Category.find({ });
    }

    public async getCategoryByName(categoryName: ICategoryData): Promise<ICategoryData | null> {
        return await DB.Models.Category.findOne(categoryName);
    }

    public async getCategoryById(categoryId: string): Promise<ICategoryData | null> {
        return await DB.Models.Category.findOne({ _id: categoryId });
    }

    public async getAllUserCategories(): Promise<any> {
        const allSurveys = await DB.Models.Survey.find({});
        const allCategories = await this.getAllCategories()
        const allSurveyCategoriyIds = allSurveys.map((survey) => survey.category_id);
        const allCategoriesNames = allSurveyCategoriyIds.map((categoryId) => {
            const categoryName = allCategories.find((category) => {
                if(category._id) {
                    return category._id.toString() === categoryId;
                }
                return false;
            });
    
            if (categoryName) {
                return {
                    categoryName: categoryName.name
                }
            }
        })
        const data = [] as any;
        const label = [] as any;
        const categoryMap = new Map();

        allCategoriesNames.forEach((categoryName: any) => {
            if (categoryMap.has(categoryName.categoryName)) {
                const currentValue = categoryMap.get(categoryName.categoryName);
                categoryMap.set(categoryName.categoryName, currentValue + 1);
            } else {
                categoryMap.set(categoryName.categoryName, 1);
            }
        });

        categoryMap.forEach((value, key) => {
            data.push(value);
            label.push(key);
        });

        return {
            data,
            label,
        }
    }
}