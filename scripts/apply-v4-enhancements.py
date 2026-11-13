import os

def update_working_process():
    path = os.path.join('src', 'components', 'WorkingProcess.tsx')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old1 = 'className="image-frame-editorial group-hover:border-brand-gold/60 transition-[border-color,box-shadow] duration-300 shadow-card"'
    new1 = 'className="image-frame-editorial group-hover:border-brand-gold/60 transition-[border-color,box-shadow] duration-300 shadow-card card-v4-inner-border"'
    old2 = 'className="image-frame-editorial mb-4 shadow-subtle"'
    new2 = 'className="image-frame-editorial mb-4 shadow-subtle card-v4-inner-border"'
    old3 = 'className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"'
    new3 = 'className="w-full h-full object-cover image-v4-zoom group-hover:scale-105 transition-transform duration-700 ease-out"'
    old4 = 'className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"'
    new4 = 'className="w-full h-full object-cover image-v4-zoom group-hover:scale-105 transition-transform duration-500 ease-out"'

    content = content.replace(old1, new1)
    content = content.replace(old2, new2)
    content = content.replace(old3, new3)
    content = content.replace(old4, new4)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("WorkingProcess.tsx updated.")

def update_contact_form():
    path = os.path.join('src', 'components', 'ContactForm.tsx')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add input-v4-focus to input elements
    content = content.replace(
        "focus:ring-2 focus:ring-[#356B50] focus:border-[#356B50] focus:outline-none",
        "focus:ring-2 focus:ring-[#356B50] focus:border-[#356B50] focus:outline-none input-v4-focus"
    )
    # Ensure form container has card-v4-luxury
    content = content.replace(
        'className="bg-brand-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-brand-border shadow-card"',
        'className="bg-brand-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-brand-border shadow-card card-v4-luxury card-v4-inner-border"'
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("ContactForm.tsx updated.")

if __name__ == '__main__':
    update_working_process()
    update_contact_form()
