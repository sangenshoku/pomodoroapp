import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskItem from '../TaskItem.vue';

describe('TaskItem', () => {
  it('should render properly', () => {
    const wrapper = mount(TaskItem, {
      props: {
        task: {
          id: '000',
          title: 'Test 1',
          completedPomodoros: 9,
          estimatedPomodoros: 1
        }
      }
    });

    expect(wrapper.text()).contains('Test 1');
    expect(wrapper.text()).contains('9 / 1');
  });

  it(`should have truthy 'checked' attribute when isDone is set to true`, () => {
    const wrapper = mount(TaskItem, {
      props: {
        task: {
          id: '000',
          title: 'Test 1',
          completedPomodoros: 0,
          estimatedPomodoros: 1,
          done: true
        }
      }
    });

    expect(wrapper.find<HTMLInputElement>('[type="checkbox"]').element.checked).toEqual(true);
  });

  it(`should be active`, async () => {
    const wrapper = mount(TaskItem, {
      props: {
        task: {
          id: '000',
          title: 'Test 1',
          completedPomodoros: 0,
          estimatedPomodoros: 1,
          done: true
        },
        active: true
      }
    });

    await wrapper.find('[data-testid="task-item"]').trigger('click');

    expect(wrapper.attributes('data-active')).toBe('true');
  });
});
