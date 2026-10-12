import { Preferences } from '@capacitor/preferences';
import { emptyPlanner, validatePlanner } from '../../../../../packages/core/planner.js';
const key = 'orbitsoft.campusplanner.v1';
export class LocalPlannerRepository {
  async load() {
    const { value } = await Preferences.get({ key });
    return value === null ? emptyPlanner() : validatePlanner(JSON.parse(value));
  }
  async save(state) {
    await Preferences.set({ key, value: JSON.stringify(validatePlanner(state)) });
  }
}
