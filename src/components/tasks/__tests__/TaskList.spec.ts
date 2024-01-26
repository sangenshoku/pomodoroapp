import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskList from '../TaskList.vue';

describe('TaskList', () => {
  it('should render properly', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [
          {
            id: '000',
            title: 'Test 1',
            completedPomodoros: 9,
            estimatedPomodoros: 1
          },
          {
            id: '001',
            title: 'Test 2',
            completedPomodoros: 9,
            estimatedPomodoros: 1
          },
          {
            id: '002',
            title: 'Test 3',
            completedPomodoros: 9,
            estimatedPomodoros: 1
          }
        ]
      }
    });

    expect(wrapper.findAllComponents('[data-testid="task-item"]')).toHaveLength(3);
  });

  it('should have only one active task when clicked', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [
          {
            id: '000',
            title: 'Test 1',
            completedPomodoros: 9,
            estimatedPomodoros: 1
          },
          {
            id: '001',
            title: 'Test 2',
            completedPomodoros: 9,
            estimatedPomodoros: 1
          },
          {
            id: '002',
            title: 'Test 3',
            completedPomodoros: 9,
            estimatedPomodoros: 1
          }
        ]
      }
    });

    const taskComponents = wrapper.findAllComponents('[data-testid="task-item"]');

    await taskComponents[1].trigger('click');

    expect(taskComponents[1].attributes('data-active')).toEqual('true');

    await taskComponents[2].trigger('click');

    expect(taskComponents[2].attributes('data-active')).toEqual('true');

    expect(taskComponents[1].attributes('data-active')).toEqual('false');
  });
});
