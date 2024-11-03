import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {<%= className %>sStore} from './<%= fileName %>.store';
describe('<%= className %>Store', () => {
    let store: any;
    let get<%= angularService %>: jest.Mocked<<%= angularService %>>;
    const mockData: any[] = []; // replace with expected data

    beforeEach(() => {
        get<%= angularService %> = {
          getFeaturedPlaylists: jest.fn(),
        } as unknown as jest.Mocked<<%= angularService %>>;
    
        TestBed.configureTestingModule({
          providers: [
            {
              provide: <%= angularService %>,
              useValue: get<%= angularService %>,
            },
            <%= className %>sStore
          ],
        });
    
        store = TestBed.inject(<%= className %>sStore);
      });

      it('should initialize with the correct default state', () => {
        expect(store.items()).toEqual([]);
        expect(store.isLoading()).toBe(false);
        expect(store.filter()).toEqual('');
         // add additional properties here

      });
    
      it('should update the filter query', () => {
        store.updateFilter('Today\'s Hits');
        expect(store.filter()).toEqual('Today\'s Hits');
      });
    
      it('should load playlists based on the filter and update the state', fakeAsync(() => {
        // mock the service response
        get<%= angularService %>.<%= angularServiceMethod %>.mockReturnValue(
          of( mockData )
        );
    
        // update the query to trigger playlist loading
        store.updateFilter('Today\'s Hits');
    
        // skip through the debounce time
        tick(300);
    
        // double check the final state
        expect(store.items()).toEqual(mockData);
        expect(store.isLoading()).toBe(false);
        expect(get<%= angularService %>.<%= angularServiceMethod %>).toHaveBeenCalledWith('Today\'s Hits');
      }));
    
      it('should handle loading error and update state accordingly', fakeAsync(() => {
        const errorResponse = new Error('Network error');
        
        get<%= angularService %>.<%= angularServiceMethod %>.mockReturnValue(
          throwError(() => errorResponse)
        );
        store.updateFilter('Today\'s Hits');
        tick(300);
        expect(store.isLoading()).toBe(false);
        expect(store.items()).toEqual([]);
        expect(get<%= angularService %>.<%= angularServiceMethod %>).toHaveBeenCalledWith('Today\'s Hits');
      }));
});